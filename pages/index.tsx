import { NavigateToResource } from '@refinedev/nextjs-router';

export default function Home() {
  return <NavigateToResource resource='stadium_type' />;
}

Home.noLayout = true;
