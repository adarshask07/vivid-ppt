// This file is deprecated in favor of ../store/useSlideStore.ts
// Keeping file to prevent import errors during migration if references exist, 
// but it should no longer be used.
import React from 'react';
export const EditorContext = React.createContext({});
export const EditorProvider: React.FC = ({ children }: any) => <>{children}</>;
export const useEditor = () => { throw new Error("useEditor is deprecated. Use useSlideStore instead."); };