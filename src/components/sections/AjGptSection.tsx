import AjGptChat from '@/components/ai/AjGptChat';

export default function AjGptSection() {
  return (
    <section id="aj-gpt" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <AjGptChat />
      </div>
    </section>
  );
}
