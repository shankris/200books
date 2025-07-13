import TwoColumnLayout from "@/components/Layout/TwoColumnLayout";

export default function HomePage() {
  return (
    <TwoColumnLayout>
      <h2>All Books</h2>
      <p>Here’s the list of books that match your filters.</p>
      {/* You can map through book data here */}
    </TwoColumnLayout>
  );
}
