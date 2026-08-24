import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IconType } from 'react-icons';
import { ComponentProps } from 'react';

interface FormButtonProps {
    isSubmitting: boolean;
    canSubmit: boolean;
    iconComponent?: LucideIcon | IconType;
    buttonType: ComponentProps<typeof Button>['type'];
    buttonVariant: ComponentProps<typeof Button>['variant']; 
    className: string;
}

export default function FormButtton({ isSubmitting, canSubmit, iconComponent: IconComponent, buttonType, buttonVariant, className }: FormButtonProps) {

    return (
      <Button
        type={buttonType}
        variant={buttonVariant}
        disabled={isSubmitting || !canSubmit}
        className={className}
      >
        {isSubmitting ? "Sending..." : "Send Message"}
        {IconComponent && <IconComponent size={15} />}
      </Button>
    );
}
