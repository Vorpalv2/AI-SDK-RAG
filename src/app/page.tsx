export default function Home() {
  return (
    <div className="flex justify-center h-screen w-screen items-center font-extrabold">
      <div className="border-2 p-8 m-8">
        <p>
          Go to
          <a className="text-red-500 underline-offset-2" href="/chat">
            {" "}
            Chat
          </a>{" "}
          to chat{" "}
        </p>
        <p>
          Go to
          <a className="text-blue-500" href="/upload">
            {" "}
            Upload PDF
          </a>{" "}
          to upload pdf.
        </p>
      </div>
    </div>
  );
}
