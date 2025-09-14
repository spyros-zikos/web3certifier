import { Button } from "~~/components";

export const LoadingButton = ({ 
    onClick, 
    disabled, 
    loading, 
    children, 
    variant = "primary",
}: {
    onClick: () => void;
    disabled?: boolean;
    loading?: boolean;
    children: React.ReactNode;
    variant?: "primary" | "warning" | "error";
}) => {
    const textAndBorder = (variant === "primary") ? "base-200" : "[#F9FBFF]";
    return (<Button 
        onClick={onClick}
        disabled={disabled || loading}
        className={`
            card w-full mt-4 transition-all duration-200
            hover:scale-105 active:scale-95
            shadow-md hover:shadow-lg
        `}
        textBorderColor={textAndBorder}
    >
            {loading ? (
                <div className="flex items-center gap-2">
                    <span className="loading loading-spinner loading-sm block"></span>
                    Processing...
                </div>
            ) : (
                children
            )}
    </Button>)
};