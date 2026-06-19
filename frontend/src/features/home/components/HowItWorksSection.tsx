import { STEPS } from "../constants";



const HowItWorksSection = () => {
  return (
    <section className="border-t pt-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">How QuickBite works</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          A simple flow built around your delivery location.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {STEPS.map((step) => {
          const Icon = step.icon;

          return (
            <div key={step.title} className="rounded-lg border bg-card p-4">
              <div className="flex size-9 items-center justify-center rounded-md bg-muted">
                <Icon className="size-4 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-sm font-medium">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {step.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HowItWorksSection;
