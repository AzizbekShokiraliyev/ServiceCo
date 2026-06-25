import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import type { AuthError } from "@supabase/supabase-js"
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
import { Button } from "../ui/button"
import PasswordField from "./shared/PasswordField"
import {
  registerSchema,
  type RegisterFormValues,
} from "../shared/validation/auth.schema"
import { supabase } from "@/lib/supaBase"

const Register = () => {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormValues) => {
    setError(null)
    setLoading(true)

    const { error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
          role: "customer",
        },
      },
    })

    setLoading(false)

    if (signUpError) {
      setError(getAuthErrorMessage(signUpError))
      return
    }

    navigate("/login")
  }

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
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <FieldGroup>
              <Field>
                <FieldLabel>Full name</FieldLabel>
                <Input
                  type="text"
                  placeholder="John Doe"
                  {...register("fullName")}
                />
                {errors.fullName && (
                  <p className="text-sm text-red-500">
                    {errors.fullName.message}
                  </p>
                )}
              </Field>
            </FieldGroup>

            <FieldGroup>
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input
                  type="email"
                  placeholder="example@gmail.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </Field>
            </FieldGroup>

            <div>
              <PasswordField {...register("password")} />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button type="submit" className="mt-2 w-full" disabled={loading}>
              {loading ? "Loading..." : "Register"}
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

function getAuthErrorMessage(error: AuthError): string {
  if (error.message.includes("already registered")) {
    return "Bu email allaqachon ro'yxatdan o'tgan"
  }
  return error.message || "Xatolik yuz berdi"
}

export default Register
