import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function SubmitButton({ pending }: { pending: boolean }) {
  return <Button type="submit">{pending ? <Spinner /> : "Send message"}</Button>;
}
