export const ActionCard = ({ 
    title, 
    description, 
    children, 
    variant = "default" 
}: { 
    title: string; 
    description?: string; 
    children: React.ReactNode; 
    variant?: "default" | "warning" | "danger" 
}) => {
    const borderColors = {
        default: "border-primary/20 hover:border-primary/40",
        warning: "border-warning/20 hover:border-warning/40",
        danger: "border-error/20 hover:border-error/40"
    };

    const bgColors = {
        default: "bg-base-100",
        warning: "bg-warning/20",
        danger: "bg-error/10"
    };

    return (
        <div className={`
            card border-2 ${borderColors[variant]} ${bgColors[variant]}
            shadow-lg hover:shadow-xl transition-all duration-300
            backdrop-blur-sm mt-8
        `}>
            <div className="card-body p-6">
                <h3 className="card-title text-lg font-bold mb-2">{title}</h3>
                {description && (
                    <p className="text-sm text-base-content/70 mb-4">{description}</p>
                )}
                {children}
            </div>
        </div>
    );
};