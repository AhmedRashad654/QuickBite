const HomeFooter = () => {
  return (
    <footer className="mt-2 border-t py-6">
      <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium text-foreground">QuickBite</p>
          <p className="mt-1">Food delivery across Egypt and Saudi Arabia.</p>
        </div>
        <nav className="flex flex-wrap gap-4">
          <a className="hover:text-foreground" href="/help">
            Help
          </a>
          <a className="hover:text-foreground" href="/terms">
            Terms
          </a>
          <a className="hover:text-foreground" href="/privacy">
            Privacy
          </a>
        </nav>
      </div>
    </footer>
  );
};

export default HomeFooter;
