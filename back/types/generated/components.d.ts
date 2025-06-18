import type { Schema, Struct } from '@strapi/strapi';

export interface CommonLink extends Struct.ComponentSchema {
  collectionName: 'components_common_links';
  info: {
    description: '';
    displayName: 'link';
  };
  attributes: {
    isExternal: Schema.Attribute.Boolean;
    isOnline: Schema.Attribute.Boolean;
    name: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface CommonMegaMenu extends Struct.ComponentSchema {
  collectionName: 'components_common_mega_menus';
  info: {
    displayName: 'mega-menu';
  };
  attributes: {
    categories: Schema.Attribute.Component<'common.link', true>;
    title: Schema.Attribute.String;
    trends: Schema.Attribute.Component<'common.link', true>;
  };
}

export interface CommonNavbar extends Struct.ComponentSchema {
  collectionName: 'components_common_navbars';
  info: {
    description: '';
    displayName: 'navbar';
  };
  attributes: {
    link: Schema.Attribute.Component<'common.link', true>;
    logo: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    megaMenu: Schema.Attribute.Component<'common.mega-menu', false>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'common.link': CommonLink;
      'common.mega-menu': CommonMegaMenu;
      'common.navbar': CommonNavbar;
    }
  }
}
