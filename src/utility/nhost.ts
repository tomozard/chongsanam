

import { NhostClient } from '@nhost/nextjs';
import { graphqlWS } from "@refinedev/nhost";

// const API_URL = "https://hujdifkduxlgodxuwmnb.nhost.run";
const WS_URL = "ws://hujdifkduxlgodxuwmnb.nhost.run/v1/graphql";

export const nhost = new NhostClient({
    adminSecret: '(CQV6y5=kFt8qOs#!^R6(bRlwSXcXAV$', 
    subdomain: process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN || '',
    region: process.env.NEXT_PUBLIC_NHOST_REGION || '',
  });

export const gqlWebSocketClient = graphqlWS.createClient({
    url: WS_URL,
    connectionParams: () => {
        const token = nhost.auth.getAccessToken();
        return {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    },
});
