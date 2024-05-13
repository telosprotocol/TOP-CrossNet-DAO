import { ReactNode } from 'react';
import Header from './VHeader';

type ILayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: ILayoutProps) {
  return (
    <div>
      <Header />
      <div>{children}</div>
    </div>
  );
}
