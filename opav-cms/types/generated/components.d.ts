import type { Schema, Struct } from '@strapi/strapi';

export interface GaleriaComparacionAntesDespues extends Struct.ComponentSchema {
  collectionName: 'components_galeria_comparacion_antes_despues';
  info: {
    description: 'Fotos antes y despu\u00E9s para proyectos B&S';
    displayName: 'Comparaci\u00F3n Antes/Despu\u00E9s';
    icon: 'compare';
  };
  attributes: {
    descripcionAntes: Schema.Attribute.String;
    descripcionDespues: Schema.Attribute.String;
    imagenAntes: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    imagenDespues: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
  };
}

export interface GaleriaGaleriaOpav extends Struct.ComponentSchema {
  collectionName: 'components_galeria_galeria_opav';
  info: {
    description: 'Galer\u00EDa de im\u00E1genes secundarias para proyectos OPAV';
    displayName: 'Galer\u00EDa OPAV';
    icon: 'images';
  };
  attributes: {
    imagenesSecundarias: Schema.Attribute.Media<'images', true>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'galeria.comparacion-antes-despues': GaleriaComparacionAntesDespues;
      'galeria.galeria-opav': GaleriaGaleriaOpav;
    }
  }
}
