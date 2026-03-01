export interface VaccineReminder {
  emoji: string;
  name: string;
  description: string;
  frequency: string;
}

export const vaccineReminders: VaccineReminder[] = [
  {
    emoji: '💉',
    name: 'V8 / V10 (Polivalente)',
    description: 'Protege contra cinomose, parvovirose, hepatite, leptospirose e parainfluenza. Essencial para filhotes e reforço anual.',
    frequency: 'Filhotes: 3 doses (45, 66, 87 dias). Adultos: reforço anual.',
  },
  {
    emoji: '🦠',
    name: 'Antirrábica',
    description: 'Protege contra a raiva, doença fatal e transmissível para humanos. Obrigatória por lei.',
    frequency: 'Dose única a partir dos 4 meses. Reforço anual.',
  },
  {
    emoji: '🤧',
    name: 'Gripe Canina (Tosse dos Canis)',
    description: 'Protege contra a traqueobronquite infecciosa, muito comum em canis, petshops e locais com muitos cães.',
    frequency: 'Dose anual. Recomendada especialmente para cães que frequentam creches e hotéis.',
  },
  {
    emoji: '🦟',
    name: 'Leishmaniose',
    description: 'Protege contra a leishmaniose visceral, transmitida pelo mosquito-palha. Doença grave e sem cura definitiva.',
    frequency: 'Protocolo inicial de 3 doses (21 em 21 dias). Reforço anual.',
  },
  {
    emoji: '🐍',
    name: 'Giardíase',
    description: 'Protege contra a giárdia, parasita intestinal que causa diarreia e desidratação.',
    frequency: '2 doses com intervalo de 21 dias. Reforço anual.',
  },
  {
    emoji: '💊',
    name: 'Vermífugo',
    description: 'Elimina vermes intestinais como lombrigas, ancilostomídeos e tênias. Fundamental para saúde digestiva.',
    frequency: 'Filhotes: a cada 15 dias até 3 meses, depois mensal até 6 meses. Adultos: a cada 3-6 meses.',
  },
  {
    emoji: '🦟',
    name: 'Antipulgas e Carrapatos',
    description: 'Previne infestações de pulgas, carrapatos e ácaros que podem transmitir doenças graves como erliquiose e babesiose.',
    frequency: 'Mensal ou trimestral, dependendo do produto.',
  },
  {
    emoji: '❤️',
    name: 'Dirofilariose (Verme do Coração)',
    description: 'Previne o verme do coração, transmitido por mosquitos. Pode causar insuficiência cardíaca e morte.',
    frequency: 'Prevenção mensal com medicamento específico. Exame anual recomendado.',
  },
  {
    emoji: '🧴',
    name: 'Limpeza de Ouvidos',
    description: 'Previne otites e infecções no canal auditivo. Raças com orelhas caídas precisam de atenção especial.',
    frequency: 'Semanal ou quinzenal, dependendo da raça.',
  },
  {
    emoji: '🦷',
    name: 'Limpeza Dentária',
    description: 'Previne tártaro, gengivite e doença periodontal. Saúde bucal impacta a saúde geral do pet.',
    frequency: 'Escovação diária em casa. Limpeza profissional anual no veterinário.',
  },
];
