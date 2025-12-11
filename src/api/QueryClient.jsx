import React, { useEffect, useState } from 'react';
import { QueryClient } from '@tanstack/react-query';


export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            useErrorBoundary: true,
        },
    }}
);