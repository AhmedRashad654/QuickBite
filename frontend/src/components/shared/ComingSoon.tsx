import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Construction } from "lucide-react";

interface ComingSoonProps {
  title?: string;
  description?: string;
  showBackButton?: boolean;
}

const ComingSoon: React.FC<ComingSoonProps> = ({
  title = "Something exciting is cooking! 🚀",
  description = "We're working hard to bring this feature to life. Stay tuned, it will be ready to serve very soon!",
  showBackButton = false,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-orange-50 text-orange-500 animate-bounce">
        <Construction size={48} strokeWidth={1.5} />
      </div>

      <h1 className="mb-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
        {title}
      </h1>

      <p className="mx-auto mb-8 max-w-md text-base text-slate-500 md:text-lg">
        {description}
      </p>

      {showBackButton && (
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-slate-800 hover:shadow-lg active:scale-95"
        >
          <ArrowLeft size={16} />
          Go Back
        </button>
      )}
    </div>
  );
};

export default ComingSoon;
