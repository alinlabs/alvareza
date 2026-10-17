import React from 'react';
import { ToolsContainer, ToolsContainerProps } from './container';

/**
 * ToolsWorkspacePage
 * Canonical page view for ATS Resume Builder & Job Dispatcher.
 */
export const ToolsWorkspacePage: React.FC<ToolsContainerProps> = (props) => {
  return <ToolsContainer {...props} />;
};

export default ToolsWorkspacePage;
