import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const DemoPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
          <div className="relative w-20 h-20 bg-card border border-border rounded-full flex items-center justify-center">
            <Heart className="w-10 h-10 text-primary" />
          </div>
        </div>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
          Demo Not Available
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          To get the full experience, order your personalized website now!
        </p>
        <div className="space-y-3">
          {id && (
            <Button asChild variant="red" size="lg" className="w-full py-6">
              <Link to={`/products/${id}`}>
                <Heart className="w-5 h-5 mr-2" /> View Product
              </Link>
            </Button>
          )}
          <button
            onClick={() => navigate("/products")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Browse all products
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemoPreview;
