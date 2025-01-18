interface DescriptionSectionProps {
    description: string;
  }
  
  export const DescriptionSection = ({ description }: DescriptionSectionProps) => (
    <article className="bg-white shadow rounded-lg p-6">
      <div className="flex mb-4">
        <p className="text-gray-700 font-semibold">Description</p>
      </div>
      <div className="max-w-full overflow-hidden">
        <p className="text-gray-700 break-words">{description}</p>
      </div>
    </article>
  );
  