"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import SectionFrame from "@/components/admin/share/SectionFrame";
import { Button } from "@/components/ui/button";
import StrengthsSection from "./StrengthSection";
import AddStrengthDrawer from "./AddStrengthDrawer";
import { StrengthsResponse } from "@/lib/interface/strength.interface";
import {
  createStrength,
  removeStrength,
  reorderStrength,
  updateStrength
} from "@/lib/api/strength";
import { useToast } from "@/hook/use-toast";

export default function StrengthsCard({
  initializeStrengthData,
  profileId
}: {
  initializeStrengthData: StrengthsResponse[];
  profileId: string;
}) {
  const [items, setItems] = useState<StrengthsResponse[]>(
    initializeStrengthData
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StrengthsResponse | null>(
    null
  );
  const { success, error } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleOpenAdd = async () => {
    setEditingItem(null);
    setDrawerOpen(true);
  };

  const handleEdit = (item: StrengthsResponse) => {
    setEditingItem(item);
    setDrawerOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!id || isLoading) return;

    setIsLoading(true);

    try {
      await removeStrength(profileId, id);

      setItems((prev) =>
        prev
          .filter((item) => item.id !== id)
          .map((item, index) => ({
            ...item,
            sortOrder: index + 1
          }))
      );
    } catch (errorMessage: any) {
      error(
        errorMessage instanceof Error ? errorMessage.message : errorMessage
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleMove = async (id: string, direction: "up" | "down") => {
    const index = items.findIndex((item) => item.id === id);

    if (index === -1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= items.length) {
      return;
    }

    const next = [...items];

    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];

    const itemsIds = next.map((item) => item.id);

    await handleReorder(itemsIds);
  };

  const handleSubmit = async (
    data: Omit<StrengthsResponse, "id" | "createdAt" | "updatedAt"> & {
      id?: string;
      fileId?: string | null;
    }
  ): Promise<StrengthsResponse> => {
    if (data.id) {
      console.log("update data: ", data);

      try {
        const responseData = await updateStrength(profileId, data.id, {
          title: data.title,
          description: data.description,
          icon: data.icon,
          color: data.color,
          fileId: data.fileId ?? null
        });

        if (responseData.id) {
          setItems((prev) =>
            prev.map((item) =>
              item.id === data.id ? { ...item, ...data, id: data.id! } : item
            )
          );

          success(`${responseData.title} updated successfully!`);
        }
        return responseData;
      } catch (errorMessage: any) {
        error(
          errorMessage instanceof Error ? errorMessage.message : errorMessage
        );
        throw errorMessage;
      }
    } else {
      try {
        const responseData = await createStrength(profileId, {
          description: data.description,
          title: data.title,
          icon: data.icon,
          color: data.color,
          sortOrder: data.sortOrder,
          fileId: data.fileId ?? null
        });

        if (responseData) {
          success(`New created ${responseData.title} strength`);
          setItems((prev) => [...prev, responseData]);
          return responseData;
        }
      } catch (errorMessage: any) {
        error(
          errorMessage instanceof Error ? errorMessage.message : errorMessage
        );
        throw errorMessage;
      }

      throw new Error("Failed to create strength");
    }
  };

  const handleReorder = async (orderedIds: string[]) => {
    if (isLoading) return;

    const previousItems = items;

    // 立即更新 UI
    setItems((prev) => {
      const map = new Map(prev.map((item) => [item.id, item]));

      return orderedIds
        .map((id) => map.get(id))
        .filter((item): item is StrengthsResponse => Boolean(item))
        .map((item, index) => ({
          ...item,
          sortOrder: index + 1
        }));
    });

    setIsLoading(true);

    try {
      await reorderStrength(profileId, orderedIds);
    } catch (errorMessage: any) {
      setItems(previousItems);

      error(
        errorMessage instanceof Error ? errorMessage.message : errorMessage
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SectionFrame className="flex h-full flex-col">
      <SectionFrame.Header className="flex items-center justify-between">
        <SectionFrame.Title>
          <span className="text-xl font-bold">Top Strengths</span>
        </SectionFrame.Title>
        <Button
          variant="default"
          className="flex items-center gap-1.5"
          onClick={handleOpenAdd}
        >
          <Plus className="h-3.5 w-3.5" />
          Add Strength
        </Button>
      </SectionFrame.Header>

      <SectionFrame.Body className="flex-1">
        <StrengthsSection
          items={items}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onMove={handleMove}
          onReorder={handleReorder}
          isLoading={isLoading}
        />
      </SectionFrame.Body>

      <AddStrengthDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        initialData={editingItem}
        onSubmit={handleSubmit}
        profileId={profileId}
      />
    </SectionFrame>
  );
}
