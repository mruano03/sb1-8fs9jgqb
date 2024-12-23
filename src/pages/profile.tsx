// Previous imports...
import { SocialLinks } from '@/components/profile/social-links';
import { ImageSpecs } from '@/components/profile/image-specs';

// Inside the ProfilePage component, after the form:
<div className="mt-8 space-y-8">
  <SocialLinks 
    links={profile?.social_links || {}}
    onSave={async (links) => {
      await updateProfile({ social_links: links });
    }}
  />
  
  <ImageSpecs />
</div>