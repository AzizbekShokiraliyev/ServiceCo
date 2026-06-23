import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card"
import { Field, FieldGroup, FieldLabel } from "../ui/field"
import { Input } from "../ui/input"
import PasswordField from "./shared/PasswordField"
import { Button } from "../ui/button"
import { Link } from "react-router-dom"

const Register = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full sm:max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Register</CardTitle>
          <CardDescription className="text-center">
            Create new account for you
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="grid gap-4">
            <FieldGroup>
              <Field>
                <FieldLabel>Full name</FieldLabel>
                <Input type="text" placeholder="John Doe" />
              </Field>
            </FieldGroup>

            <FieldGroup>
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input type="email" placeholder="example@gmail.com" />
              </Field>
            </FieldGroup>

            <PasswordField />

            <Button type="submit" className="w-full">
              Register
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center text-sm">
          <p className="text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary underline">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Register
