export const FIELD_LABELS = {
  label: '名称',
  description: '简述',
  appearance: '外形',
  ability: '能力',
  location: '出没地',
  chapter: '出处',
  aliases: '别名',
};
export const INFOBOX_SKIP = new Set(['id', 'type', 'quality', 'tags', 'coords']);
export const FIELD_GROUPS = [
  { label: '基本信息', fields: ['label', 'description', 'appearance'] },
  { label: '详细信息', fields: ['ability', 'location', 'chapter'] },
];
