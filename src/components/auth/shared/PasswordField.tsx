import { forwardRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { EyeIcon, EyeOffIcon } from "lucide-react"

const PasswordField = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => {
  const [show, setShow] = useState(false)
  return (
    <FieldGroup>
      <Field>
        <FieldLabel>Password</FieldLabel>
        <InputGroup>
          <InputGroupInput
            type={show ? "text" : "password"}
            placeholder="********"
            ref={ref}
            {...props}
          />
          <InputGroupAddon align="inline-end">
            <Button
              size="icon"
              type="button"
              variant="ghost"
              onClick={() => setShow(!show)}
            >
              {show ? <EyeIcon /> : <EyeOffIcon />}
            </Button>
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </FieldGroup>
  )
})
PasswordField.displayName = "PasswordField"

export default PasswordField
