declare module 'react-beautiful-dnd' {
  import * as React from 'react';

  // DragDropContext
  export interface DragDropContextProps {
    onDragEnd: (result: DropResult) => void;
    onDragStart?: (initial: DragStart) => void;
    onDragUpdate?: (update: DragUpdate) => void;
    children?: React.ReactNode;
  }

  export class DragDropContext extends React.Component<DragDropContextProps> {}

  // Droppable
  export interface DroppableProps {
    droppableId: string;
    type?: string;
    direction?: 'horizontal' | 'vertical';
    isDropDisabled?: boolean;
    isCombineEnabled?: boolean;
    ignoreContainerClipping?: boolean;
    renderClone?: any;
    getContainerForClone?: any;
    children: (provided: DroppableProvided, snapshot: DroppableStateSnapshot) => React.ReactElement<any>;
  }

  export class Droppable extends React.Component<DroppableProps> {}

  // Draggable
  export interface DraggableProps {
    draggableId: string;
    index: number;
    isDragDisabled?: boolean;
    disableInteractiveElementBlocking?: boolean;
    shouldRespectForcePress?: boolean;
    children: (provided: DraggableProvided, snapshot: DraggableStateSnapshot, rubric: DraggableRubric) => React.ReactElement<any>;
  }

  export class Draggable extends React.Component<DraggableProps> {}

  // Types
  export interface DraggableLocation {
    droppableId: string;
    index: number;
  }

  export interface DraggableRubric {
    draggableId: string;
    type: string;
    source: DraggableLocation;
  }

  export interface DraggableProvided {
    innerRef: (element: HTMLElement | null) => void;
    draggableProps: {
      style?: React.CSSProperties;
      'data-rbd-draggable-context-id'?: string;
      'data-rbd-draggable-id'?: string;
      onTransitionEnd?: (event: React.TransitionEvent<any>) => void;
    };
    dragHandleProps?: {
      'data-rbd-drag-handle-draggable-id'?: string;
      'data-rbd-drag-handle-context-id'?: string;
      role?: string;
      'aria-grabbed'?: boolean;
      tabIndex?: number;
      draggable?: boolean;
      onDragStart?: (event: React.DragEvent<any>) => void;
    };
  }

  export interface DraggableStateSnapshot {
    isDragging: boolean;
    isDropAnimating: boolean;
    draggingOver?: string;
    dropAnimation?: {
      duration: number;
      curve: string;
      moveTo: {
        x: number;
        y: number;
      };
    };
    combineWith?: string;
    combineTargetFor?: string;
    mode?: string;
  }

  export interface DroppableProvided {
    innerRef: (element: HTMLElement | null) => void;
    placeholder?: React.ReactElement<any> | null;
    droppableProps: {
      'data-rbd-droppable-id'?: string;
      'data-rbd-droppable-context-id'?: string;
    };
  }

  export interface DroppableStateSnapshot {
    isDraggingOver: boolean;
    draggingOverWith?: string;
    draggingFromThisWith?: string;
    isUsingPlaceholder: boolean;
  }

  export interface DragStart {
    draggableId: string;
    type: string;
    source: DraggableLocation;
    mode: 'FLUID' | 'SNAP';
  }

  export interface DragUpdate extends DragStart {
    destination?: DraggableLocation | null;
    combine?: {
      draggableId: string;
      droppableId: string;
    } | null;
  }

  export interface DropResult extends DragUpdate {
    reason: 'DROP' | 'CANCEL';
  }
}
