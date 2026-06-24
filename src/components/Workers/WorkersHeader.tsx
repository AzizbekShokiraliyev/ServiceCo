interface WorkersHeaderProps {
  // FIX: accept props — hardcoded name/role makes this component useless for any other worker
  name: string
  role: string
}

export default function WorkersHeader({ name, role }: WorkersHeaderProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">{name}</h1>
      <div className="mt-1 flex items-center gap-2">
        <span className="text-sm text-muted-foreground">{role}</span>
      </div>
    </div>
  )
}
