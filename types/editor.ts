export interface ToolbarConfig {
  headers?: boolean;
  font?: boolean;
  size?: boolean;
  formatting?: boolean;
  colors?: boolean;
  lists?: boolean;
  link?: boolean;
  image?: boolean;
  align?: boolean;
  clean?: boolean;
  blockquote?: boolean;
  codeBlock?: boolean;
}

export interface EditorProps {
  onChangeAction?: (value: string) => void; // Made optional
  value: string | undefined;
  onErrorAction?: (error: string) => void;
  maxFileSize?: number;
  allowedFileTypes?: string[];
  debounceDelay?: number;
  toolbarConfig?: ToolbarConfig;
  maxLength?: number;
  onCharCountChangeAction?: (count: number) => void;
}
