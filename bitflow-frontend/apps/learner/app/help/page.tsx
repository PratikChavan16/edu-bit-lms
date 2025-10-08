import { Card, CardContent, CardHeader, CardTitle } from "@bitflow/ui/card";
import { Button } from "@bitflow/ui/button";
import { Separator } from "@bitflow/ui/separator";

const faqs = [
  {
    id: "attendance",
    question: "How is attendance calculated?",
    answer: "Attendance is aggregated across all subjects. Percentages update every hour based on faculty submissions.",
  },
  {
    id: "documents",
    question: "What file formats are accepted for documents?",
    answer: "PDF, PNG, and JPEG up to 5 MB each. For other formats, contact your admin before uploading.",
  },
  {
    id: "support",
    question: "How do I raise a ticket?",
    answer: "Use the 'Create ticket' button below. Provide course, issue type, and detailed description for faster responses.",
  },
];

export default function HelpPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Help center</h1>
          <p className="text-muted-foreground">Get answers quickly or raise a support ticket.</p>
        </div>
        <Button>View open tickets</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>FAQs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.id}>
              <p className="text-sm font-semibold">{faq.question}</p>
              <p className="text-sm text-muted-foreground">{faq.answer}</p>
              <Separator className="my-3" />
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Create support ticket</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>Go to the Helpdesk portal to submit detailed issues, attach documents, and track resolution progress.</p>
          <Button>Open helpdesk</Button>
        </CardContent>
      </Card>
    </div>
  );
}
