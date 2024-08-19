"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { validateUser } from "@/_action";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const HandleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    try {
      setLoading(true);
      const data = await validateUser(email, password);
      if (data?.message) setLoading(false);
      setErrorMessage(data?.message || ""); // Set error message or clear it
    } catch (error) {
      setErrorMessage("An error occurred. Please try again."); // Handle errors
    }
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Stocks Manager</CardTitle>
        <CardDescription>Enter the details to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={HandleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                name="email"
                id="email"
                type="email"
                placeholder="Enter the email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter the password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Link
              href={"/sign-up"}
              className={cn(
                buttonVariants({ variant: "link" }),
                "w-full text-center"
              )}
            >
              Create an account
            </Link>

            {errorMessage && <div className="text-red-600">{errorMessage}</div>}
          </div>

          <div className="pt-6 flex justify-between">
            <Button disabled={loading} variant="outline" type="button">
              Cancel
            </Button>
            <Button disabled={loading} type="submit">
              {loading && (
                <span className=" w-4 h-4 rounded-full mr-2 animate-spin border-t-2 border-2 border-t-indigo-500 border-indigo-200 " />
              )}
              Sign-in
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
