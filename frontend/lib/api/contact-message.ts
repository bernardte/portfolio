import { ContactMessage } from "../interface/contact-message.interface";
import { apiClient } from "./client";

export function sendContactMessage(value: ContactMessage, slug: string): Promise<ContactMessage> {
    return apiClient(`/contact-message/${slug}`, {
        method: "POST",
        body: JSON.stringify(value)
    })
}