import BottomNav from './BottomNav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto min-h-screen max-w-lg bg-background pb-20">
      {children}
      <BottomNav />
    </div>
  );
}
