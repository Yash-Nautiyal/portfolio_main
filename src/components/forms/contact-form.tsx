"use client";

import { useState } from "react";
import { config } from "@/data/config";
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

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !message.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please add valid name, email and message.");
      return;
    }
    setPending(true);
    const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:${config.email}?subject=${subject}&body=${body}`;
    setPending(false);
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
      <SubmitButton pending={pending} />
    </form>
  );
}
