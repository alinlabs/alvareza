import React from 'react';
import { ToolsContainer, ToolsContainerProps } from './container';

export * from './types';
export * from './constants';
export * from './container';
export * from './ToolsWorkspacePage';
export { ToolsContainer as ToolsPage } from './container';
export { ToolsWorkspacePage as MyCivyPage, ToolsWorkspacePage as AdminWorkspacePage } from './ToolsWorkspacePage';
export { ToolsContainer as AdminContainer } from './container';

export * from './HeaderNavbar';
export * from './PrintableView';
export * from './pdf-preview';
export * from './modal-preset';
export * from './modal-design';
export * from './modal-setting';
export * from './modal-history';
export * from './PrintableShared';
export * from './GlobalDragDropZone';

// Lamar Kerja Modular Suite
export * from './lamar-kerja';

/**
 * Default Page Component
 */
export const ToolsWorkspace: React.FC<ToolsContainerProps> = (props) => {
  return <ToolsContainer {...props} />;
};

export default ToolsContainer;
export * from './section';
