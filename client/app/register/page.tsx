import { RegisterForm } from "@/components/auth/register-form"
import { BookOpen } from "lucide-react"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-primary items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary-foreground/10 mb-8">
            <BookOpen className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-primary-foreground mb-4 text-balance">Library Management System</h1>
          <p className="text-primary-foreground/80 text-lg leading-relaxed">
            Join our community and  track your reading history, and more.
          </p>
        </div>
      </div>

     
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md">
        
          <div className="lg:hidden text-center mb-6">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary mb-4">
              <BookOpen className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Library Management System</h1>
          </div>

          <RegisterForm />
        </div>
      </div>
    </div>
  )
}
