import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-4xl text-center space-y-8">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary mb-6">
            <BookOpen className="h-10 w-10 text-primary-foreground" />
          </div>
          
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Library Management System
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Manage your library and track your books
          </p>
          
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8">
              <Link href="/register">Create Account</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
