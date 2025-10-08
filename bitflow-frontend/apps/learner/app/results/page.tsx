import { Badge } from "@bitflow/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@bitflow/ui/card";
import { Input } from "@bitflow/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@bitflow/ui/table";

const results = [
  {
    name: "Mid-term Mechanics",
    type: "MCQ",
    subject: "Mechanical",
    faculty: "Dr. Mehta",
    score: "82%",
    status: "Pass",
  },
  {
    name: "Lab practical",
    type: "Practical",
    subject: "Electronics",
    faculty: "Prof. Salvi",
    score: "Pending",
    status: "In review",
  },
  {
    name: "Quiz #5",
    type: "MCQ",
    subject: "Mathematics",
    faculty: "Dr. Iyer",
    score: "92%",
    status: "Pass",
  },
];

export default function ResultsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Results</h1>
          <p className="text-muted-foreground">Review assessments, scores, and teacher feedback.</p>
        </div>
        <Input placeholder="Filter by subject or assessment" className="md:max-w-sm" />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Assessment history</CardTitle>
          <CardDescription>Latest 10 assessments.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Assessment</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Faculty</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result) => (
                <TableRow key={result.name}>
                  <TableCell className="font-medium">{result.name}</TableCell>
                  <TableCell>{result.type}</TableCell>
                  <TableCell>{result.subject}</TableCell>
                  <TableCell>{result.faculty}</TableCell>
                  <TableCell>{result.score}</TableCell>
                  <TableCell>
                    <Badge variant={result.status === "Pass" ? "success" : result.status === "Fail" ? "destructive" : "secondary"}>
                      {result.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
