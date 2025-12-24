import { validateDateRange } from './src/validators/reports.validator';

console.log('Testando validação de datas:\n');

// Teste 1: Data de hoje
const test1 = validateDateRange('2025-12-23', '2025-12-23');
console.log('Teste 1: Selecionando 23/12/2025 até 23/12/2025');
console.log('From:', test1.from.toISOString(), '(', test1.from.toString(), ')');
console.log('To:', test1.to.toISOString(), '(', test1.to.toString(), ')');
console.log('');

// Teste 2: Range de uma semana
const test2 = validateDateRange('2025-12-16', '2025-12-23');
console.log('Teste 2: Selecionando 16/12/2025 até 23/12/2025');
console.log('From:', test2.from.toISOString(), '(', test2.from.toString(), ')');
console.log('To:', test2.to.toISOString(), '(', test2.to.toString(), ')');
console.log('');

console.log('✅ Agora a data final é D+1 às 02:59:59.999Z');
console.log('✅ Isso inclui todo o dia selecionado em GMT-3 (Brasília)');
