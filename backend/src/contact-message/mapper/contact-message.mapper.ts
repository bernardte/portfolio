import { ContactMessage } from "../entities/contact-message.entity";

export class ContactMessageMapper {
    static toResponse(contactMessage: ContactMessage) {
        return {
            id: contactMessage.id,
            subject: contactMessage.subject,
            email: contactMessage.email,
            message: contactMessage.message,
            name: contactMessage.name,
            createdAt: contactMessage.createdAt
        }
    }
}