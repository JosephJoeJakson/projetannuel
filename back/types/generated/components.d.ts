import type { Schema, Struct } from '@strapi/strapi';

export interface CommonFooterHelpMenu extends Struct.ComponentSchema {
  collectionName: 'components_common_footer_help_menus';
  info: {
    description: "Menu Besoin d'aide du footer";
    displayName: 'footer-help-menu';
  };
  attributes: {
    link: Schema.Attribute.Component<'common.link', true>;
  };
}

export interface CommonFooterMenu extends Struct.ComponentSchema {
  collectionName: 'components_common_footer_menus';
  info: {
    description: 'Menu du footer';
    displayName: 'footer-menu';
  };
  attributes: {
    link: Schema.Attribute.Component<'common.link', true>;
  };
}

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

export interface CommonSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_common_social_links';
  info: {
    description: 'Lien de r\u00E9seau social';
    displayName: 'social-link';
  };
  attributes: {
    icon: Schema.Attribute.String;
    name: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface PageBlocksColumn extends Struct.ComponentSchema {
  collectionName: 'components_page_blocks_column';
  info: {
    description: "Contenu d'une colonne";
    displayName: 'Colonne';
  };
  attributes: {
    backgroundColor: Schema.Attribute.String;
    content: Schema.Attribute.RichText;
    image: Schema.Attribute.Media<'images'>;
    imagePosition: Schema.Attribute.Enumeration<['top', 'bottom']> &
      Schema.Attribute.DefaultTo<'top'>;
    padding: Schema.Attribute.String;
    textAlign: Schema.Attribute.Enumeration<['left', 'center', 'right']> &
      Schema.Attribute.DefaultTo<'left'>;
    title: Schema.Attribute.String;
  };
}

export interface PageBlocksColumnsBlock extends Struct.ComponentSchema {
  collectionName: 'components_page_blocks_columns_block';
  info: {
    description: 'Bloc avec contenu organis\u00E9 en colonnes';
    displayName: 'Bloc Colonnes';
  };
  attributes: {
    backgroundColor: Schema.Attribute.String;
    columns: Schema.Attribute.Component<'page-blocks.column', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 4;
          min: 1;
        },
        number
      >;
    columnsLayout: Schema.Attribute.Enumeration<
      ['2-columns', '3-columns', '4-columns', '1-2', '2-1', '1-1-2', '2-1-1']
    > &
      Schema.Attribute.DefaultTo<'2-columns'>;
    gap: Schema.Attribute.String & Schema.Attribute.DefaultTo<'2rem'>;
    margin: Schema.Attribute.String;
    padding: Schema.Attribute.String;
    responsive: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    title: Schema.Attribute.String;
  };
}

export interface PageBlocksCtaBlock extends Struct.ComponentSchema {
  collectionName: 'components_page_blocks_cta_block';
  info: {
    description: 'Bloc call-to-action avec boutons et mise en forme';
    displayName: 'Bloc CTA';
  };
  attributes: {
    backgroundColor: Schema.Attribute.String;
    backgroundImage: Schema.Attribute.Media<'images'>;
    buttons: Schema.Attribute.Component<'page-blocks.cta-button', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 3;
        },
        number
      >;
    description: Schema.Attribute.Text;
    margin: Schema.Attribute.String;
    overlayColor: Schema.Attribute.String;
    overlayOpacity: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          max: 1;
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0.3>;
    padding: Schema.Attribute.String;
    textAlign: Schema.Attribute.Enumeration<['left', 'center', 'right']> &
      Schema.Attribute.DefaultTo<'center'>;
    textColor: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PageBlocksCtaButton extends Struct.ComponentSchema {
  collectionName: 'components_page_blocks_cta_button';
  info: {
    description: 'Bouton pour les blocs call-to-action';
    displayName: 'Bouton CTA';
  };
  attributes: {
    icon: Schema.Attribute.String;
    openInNewTab: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    size: Schema.Attribute.Enumeration<['small', 'medium', 'large']> &
      Schema.Attribute.DefaultTo<'medium'>;
    style: Schema.Attribute.Enumeration<
      ['primary', 'secondary', 'outline', 'ghost']
    > &
      Schema.Attribute.DefaultTo<'primary'>;
    text: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PageBlocksDocumentBlock extends Struct.ComponentSchema {
  collectionName: 'components_page_blocks_document_block';
  info: {
    description: 'Bloc pour afficher des documents t\u00E9l\u00E9chargeables';
    displayName: 'Bloc Document';
  };
  attributes: {
    backgroundColor: Schema.Attribute.String;
    buttonStyle: Schema.Attribute.Enumeration<
      ['primary', 'secondary', 'outline']
    > &
      Schema.Attribute.DefaultTo<'primary'>;
    buttonText: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'T\u00E9l\u00E9charger'>;
    description: Schema.Attribute.Text;
    document: Schema.Attribute.Media<'files'> & Schema.Attribute.Required;
    margin: Schema.Attribute.String;
    padding: Schema.Attribute.String;
    showFileInfo: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    title: Schema.Attribute.String;
  };
}

export interface PageBlocksHeroBlock extends Struct.ComponentSchema {
  collectionName: 'components_page_blocks_hero_block';
  info: {
    description: 'Bloc hero avec image de fond, titre et description';
    displayName: 'Bloc Hero';
  };
  attributes: {
    backgroundColor: Schema.Attribute.String;
    backgroundImage: Schema.Attribute.Media<'images'>;
    buttonStyle: Schema.Attribute.Enumeration<
      ['primary', 'secondary', 'outline']
    > &
      Schema.Attribute.DefaultTo<'primary'>;
    buttonText: Schema.Attribute.String;
    buttonUrl: Schema.Attribute.String;
    height: Schema.Attribute.Enumeration<['small', 'medium', 'large', 'full']> &
      Schema.Attribute.DefaultTo<'medium'>;
    margin: Schema.Attribute.String;
    overlayColor: Schema.Attribute.String;
    overlayOpacity: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          max: 1;
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0.3>;
    padding: Schema.Attribute.String;
    secondaryButtonText: Schema.Attribute.String;
    secondaryButtonUrl: Schema.Attribute.String;
    subtitle: Schema.Attribute.Text;
    textAlign: Schema.Attribute.Enumeration<['left', 'center', 'right']> &
      Schema.Attribute.DefaultTo<'center'>;
    textColor: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PageBlocksImageBlock extends Struct.ComponentSchema {
  collectionName: 'components_page_blocks_image_block';
  info: {
    description: "Bloc d'image avec options de mise en page";
    displayName: 'Bloc Image';
  };
  attributes: {
    altText: Schema.Attribute.String;
    backgroundColor: Schema.Attribute.String;
    caption: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    imageAlign: Schema.Attribute.Enumeration<['left', 'center', 'right']> &
      Schema.Attribute.DefaultTo<'center'>;
    imageSize: Schema.Attribute.Enumeration<
      ['small', 'medium', 'large', 'full']
    > &
      Schema.Attribute.DefaultTo<'medium'>;
    lightbox: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    margin: Schema.Attribute.String;
    padding: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface PageBlocksTextBlock extends Struct.ComponentSchema {
  collectionName: 'components_page_blocks_text_block';
  info: {
    description: 'Bloc de contenu texte avec formatage';
    displayName: 'Bloc Texte';
  };
  attributes: {
    backgroundColor: Schema.Attribute.String;
    content: Schema.Attribute.RichText & Schema.Attribute.Required;
    margin: Schema.Attribute.String;
    padding: Schema.Attribute.String;
    textAlign: Schema.Attribute.Enumeration<
      ['left', 'center', 'right', 'justify']
    > &
      Schema.Attribute.DefaultTo<'left'>;
    textColor: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface PageBlocksVideoBlock extends Struct.ComponentSchema {
  collectionName: 'components_page_blocks_video_block';
  info: {
    description: 'Bloc vid\u00E9o avec support pour YouTube, Vimeo et fichiers locaux';
    displayName: 'Bloc Vid\u00E9o';
  };
  attributes: {
    autoplay: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    backgroundColor: Schema.Attribute.String;
    caption: Schema.Attribute.Text;
    controls: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    loop: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    margin: Schema.Attribute.String;
    muted: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    padding: Schema.Attribute.String;
    title: Schema.Attribute.String;
    videoAlign: Schema.Attribute.Enumeration<['left', 'center', 'right']> &
      Schema.Attribute.DefaultTo<'center'>;
    videoFile: Schema.Attribute.Media<'videos'>;
    videoId: Schema.Attribute.String;
    videoSize: Schema.Attribute.Enumeration<
      ['small', 'medium', 'large', 'full']
    > &
      Schema.Attribute.DefaultTo<'medium'>;
    videoType: Schema.Attribute.Enumeration<['youtube', 'vimeo', 'local']> &
      Schema.Attribute.Required;
    videoUrl: Schema.Attribute.String;
  };
}

export interface ProductKeyValuePair extends Struct.ComponentSchema {
  collectionName: 'components_product_key_value_pairs';
  info: {
    displayName: 'key_value_pair';
  };
  attributes: {
    title: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'common.footer-help-menu': CommonFooterHelpMenu;
      'common.footer-menu': CommonFooterMenu;
      'common.link': CommonLink;
      'common.mega-menu': CommonMegaMenu;
      'common.navbar': CommonNavbar;
      'common.social-link': CommonSocialLink;
      'page-blocks.column': PageBlocksColumn;
      'page-blocks.columns-block': PageBlocksColumnsBlock;
      'page-blocks.cta-block': PageBlocksCtaBlock;
      'page-blocks.cta-button': PageBlocksCtaButton;
      'page-blocks.document-block': PageBlocksDocumentBlock;
      'page-blocks.hero-block': PageBlocksHeroBlock;
      'page-blocks.image-block': PageBlocksImageBlock;
      'page-blocks.text-block': PageBlocksTextBlock;
      'page-blocks.video-block': PageBlocksVideoBlock;
      'product.key-value-pair': ProductKeyValuePair;
    }
  }
}
