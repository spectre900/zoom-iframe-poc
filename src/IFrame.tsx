import { useRef, useState, useEffect, CSSProperties } from "react";
import { createPortal } from "react-dom";

const IFrame = (props: { children: React.ReactNode; style: CSSProperties }) => {
  const iFrameRef = useRef<HTMLIFrameElement>(null);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const iFrameBody = iFrameRef.current?.contentDocument?.body;
    if (iFrameBody) {
      setMountNode(iFrameBody);
    }
  }, []);

  return (
    <iframe ref={iFrameRef} style={props.style}>
      {mountNode && createPortal(props.children, mountNode)}
    </iframe>
  );
};

export default IFrame;
