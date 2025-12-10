"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BookOpen, UserCheck, BookMarked } from "lucide-react"
import type { AdminUser, AdminBook } from "@/lib/types"
import { ReadingStatus } from "@/lib/types"

interface OverviewTabProps {
  users: AdminUser[]
  books: AdminBook[]
  totalBooksCount: number
}

export function OverviewTab({ users, books, totalBooksCount }: OverviewTabProps) {
  const totalUsers = users.length
  const adminCount = users.filter((u) => u.role === "Admin").length
  const completedBooks = books.filter((b) => b.readingStatus === ReadingStatus.Completed).length

  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      description: `${adminCount} admin${adminCount !== 1 ? "s" : ""}`,
    },
    {
      title: "Total Books",
      value: totalBooksCount,
      icon: BookOpen,
      description: "Across all users",
    },
    {
      title: "Active Readers",
      value: users.filter((u) => u.totalBooks > 0).length,
      icon: UserCheck,
      description: "Users with books",
    },
    {
      title: "Completed Books",
      value: completedBooks,
      icon: BookMarked,
      description: "Finished reading",
    },
  ]

  // Recent users
  const recentUsers = [...users]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentUsers.length === 0 ? (
              <p className="text-sm text-muted-foreground">No users yet.</p>
            ) : (
              recentUsers.map((user) => (
                <div key={user.userId} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                      {user.firstName?.charAt(0) || user.userName?.charAt(0) || "U"}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{user.fullName}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                        user.role === "Admin" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
                      )}
                    >
                      {user.role}
                    </span>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {user.totalBooks} book{user.totalBooks !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
