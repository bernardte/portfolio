"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/components/admin/navbar/AdminNavbar";
import Sidebar from "@/components/admin/share/Sidebar";
import { fetchUserApi } from "@/lib/api/user";
import { User } from "@/lib/interface/user.interface";
import { ProfileInformationResponse } from "@/lib/interface/profile.interface";
import { fetchProfile } from "@/lib/api/profile-information";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileInformationResponse>();
  useEffect(() => {
    const handleFetchProfile = async () => {
      const response = await fetchProfile();
      setProfile(response);
    };

    handleFetchProfile();
  }, []);

  useEffect(() => {
    let isMounted = true;

    const getUserDetail = async () => {
      try {
        const userDetail = await fetchUserApi();
        if (isMounted) {
          if (userDetail) {
            setUser(userDetail);
          } else {
            // 未获取到用户信息，安全重定向到登录页或 401 页面
            router.push("/login");
          }
        }
      } catch (error) {
        if (isMounted) {
          router.push("/login");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    getUserDetail();

    return () => {
      isMounted = false;
    };
  }, [router]); // 👈 移除 fetchUserApi 依赖，防止无限触发

  // 2. 加载完成但没有 User 数据时阻止渲染（跳转中）
  if (!user) {
    return null;
  }

  // 3. 正常渲染页面
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar
        user={user}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminNavbar
          onToggleSidebar={() => setMobileOpen((prev) => !prev)}
          slug={profile?.slug ?? ""}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
