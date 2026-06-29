import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import type { ListContainerProps } from "@/interface/Interface"

export function ListContainer({
  title,
  description,
  headerAction,
  children,
  footer,
  className = "",
}: ListContainerProps) {
  return (
    <Card className={`flex flex-col ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            <div className="text-base font-bold tracking-tight">{title}</div>
          </CardTitle>
          {headerAction && <div>{headerAction}</div>}
        </div>
        {description && (
          <CardDescription>
            <div className="mt-1">{description}</div>
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden">
        <div className="space-y-4">{children}</div>
      </CardContent>

      {footer && (
        <CardFooter>
          <div className="w-full">{footer}</div>
        </CardFooter>
      )}
    </Card>
  )
}
