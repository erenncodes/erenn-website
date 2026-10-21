import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { Template } from "@/data/templates";

interface TemplateCardProps {
  template: Template;
}

const TemplateCard = ({ template }: TemplateCardProps) => {
  return (
    <Link
      to={`/products/${template.id}`}
      className="group block bg-card rounded-2xl overflow-hidden border border-border card-hover"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={template.thumbnail}
          alt={template.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex items-center gap-2 px-4 py-2 bg-primary rounded-full text-primary-foreground font-medium text-sm">
            <ExternalLink size={16} />
            View Details
          </div>
        </div>

        {/* Tags */}
        <div className="absolute top-3 left-3 right-3 flex justify-between">
          <span className="px-3 py-1 rounded-full bg-accent/90 text-accent-foreground text-xs font-medium capitalize">
            {template.category}
          </span>
          {template.isNew && (
            <span className="px-3 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-medium">
              New
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
          {template.title}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
          {template.description}
        </p>
        
        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="text-sm">
            <span className="text-muted-foreground">From </span>
            <span className="text-primary font-semibold">Rs. {template.price.livesite}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Code: Rs. {template.price.code}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TemplateCard;