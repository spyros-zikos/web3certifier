import { Button } from "~~/components";

export const LoadingButton = ({ 
    onClick, 
    disabled, 
    loading, 
    children, 
    bgColor = "green",
}: {
    onClick: () => void;
    disabled?: boolean;
    loading?: boolean;
    children: React.ReactNode;
    bgColor?: "green" | "black";
}) => {
    return (<Button 
        onClick={onClick}
        disabled={disabled || loading}
        className={`
            block w-full mt-16 transition-all duration-200
            hover:scale-105 active:scale-95
            shadow-md hover:shadow-lg
        `}
        bgColor={bgColor}
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