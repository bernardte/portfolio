import { Info_Item } from "@/constants/infoItem";
import { Contact, LucideIcon } from "lucide-react";
import { IconType } from "react-icons";
import ContactForm from "./ContactForm";
import Image from "next/image";

export default function ContactSection() {
  return (
    <section id="contact" className="mx-auto mt-12 max-w-7xl px-2">
      <div className="border-brand-accent/10 bg-brand-accent/5 mx-3 flex flex-col items-center gap-6 rounded-2xl border p-4 md:mx-5 md:p-6 lg:flex-row lg:gap-8 lg:p-8">
        {/* 左侧：联系方式 */}
        <ContactInfo />

        {/* 中间：表单 + 图片（在移动端垂直排列，桌面端同一行） */}
        <div className="flex w-full flex-1 flex-col items-center gap-6 lg:flex-row lg:items-center">
          <div className="w-full flex-1">
            <ContactForm />
          </div>

          {/* 图片：移动端放在表单下方，桌面端放在右侧 */}
          <div className="flex w-full justify-center lg:w-auto lg:shrink-0">
            <Image
              src="https://potential-turquoise-549xxhxf.edgeone.dev/file.png"
              alt="contact-us-image"
              width={300}
              height={300}
              className="h-auto w-full max-w-[200px] object-contain sm:max-w-[240px] lg:max-w-[280px]"
              priority={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactInfo() {
  return (
    <div className="flex w-full flex-col gap-4 lg:w-72 lg:shrink-0 xl:w-80">
      {/* Brief Introduce and contact*/}
      <div className="text-brand-primary flex items-center gap-2">
        <Contact size={18} />
        <span className="text-sm font-medium">Contact</span>
      </div>

      <h1 className="text-2xl font-bold text-white sm:text-3xl">
        Let&apos;s Work Together
      </h1>

      <p className="text-sm text-wrap text-neutral-400 sm:text-base">
        I&apos;m currently open to new opportunities and collaborations. Feel
        free to reach out!
      </p>

      <div className="mt-2 flex flex-col gap-4">
        {Info_Item.map((info) => {
          if (info.label === "Education") return null;

          return (
            <ContactInfoDetail
              key={info.label}
              Icon={info.icon}
              value={info.value}
            />
          );
        })}
      </div>
    </div>
  );
}

interface ContactInfoDetailProps {
  Icon: LucideIcon | IconType;
  value: string;
}

function ContactInfoDetail({ Icon, value }: ContactInfoDetailProps) {
  return (
    <div className="flex items-center gap-4 sm:gap-6">
      <div className="bg-brand-accent/10 shrink-0 rounded-2xl px-3 py-3">
        <Icon size={20} className="text-brand-primary" />
      </div>
      <div className="min-w-0 text-sm break-words text-white sm:text-base">
        {value}
      </div>
    </div>
  );
}
