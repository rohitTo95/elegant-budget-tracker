import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Expense Tracker</CardTitle>
          <CardDescription>
            Manage your finances with our elegant black & white expense tracking app
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Track your income and expenses, visualize your financial data, and take control of your budget.
          </p>
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link to="/login">Sign In</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/signup">Create Account</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
