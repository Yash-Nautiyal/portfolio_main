"use client";

import { useState } from "react";
import { FormError } from "./form-error";
import { FormField } from "./form-field";
import { SubmitButton } from "./submit-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim() || !message.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please add valid name, email and message.");
      return;
    }

    setPending(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: unknown }
          | null;
        const message =
          typeof data?.error === "string"
            ? data.error
            : "Failed to send message. Please try again.";
        setError(message);
        return;
      }

      setSuccess("Message sent successfully. I'll get back to you soon.");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormField label="Name">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
        />
      </FormField>
      <FormField label="Email">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
        />
      </FormField>
      <FormField label="Message">
        <Textarea
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell me about the role/project"
        />
      </FormField>
      <FormError message={error} />
      {success ? <p className="text-sm text-emerald-500">{success}</p> : null}
      <SubmitButton pending={pending} />
    </form>
  );
}
