import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Termo de Participação do Sorteio | X1 Games Experience',
  description: 'Termos e condições para participação no sorteio da X1 Games Experience',
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-purple-900">
      <div className="container mx-auto px-6 py-12 md:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 border-b border-border pb-6">
            <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Termo de Participação do Sorteio
            </h1>
          </div>

          <div className="space-y-8 text-foreground/90">
            {/* Seção 1 */}
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground md:text-2xl">
                1. Organização
              </h2>
              <p className="leading-relaxed">
                Este sorteio é organizado por{' '}
                <strong className="font-semibold text-foreground">X1 Games Experience</strong>,
                doravante denominada simplesmente &quot;Organizadora&quot;.
              </p>
            </section>

            {/* Seção 2 */}
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground md:text-2xl">
                2. Período do Sorteio
              </h2>
              <p className="leading-relaxed">
                O período de participação ocorrerá de{' '}
                <strong className="font-semibold text-foreground">
                  terça a domingo, das 16h às 18h
                </strong>
                .
              </p>
            </section>

            {/* Seção 3 */}
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground md:text-2xl">
                3. Como Participar
              </h2>
              <p className="leading-relaxed">Para participar, o interessado deverá:</p>
              <ul className="ml-6 list-disc space-y-2 leading-relaxed">
                <li>
                  Realizar a{' '}
                  <strong className="font-semibold text-foreground">compra de 1 hora</strong> em
                  qualquer equipamento no período entre{' '}
                  <strong className="font-semibold text-foreground">16h e 18h</strong>.
                </li>
              </ul>
              <p className="leading-relaxed">
                Participações que não atenderem aos requisitos acima serão automaticamente
                desconsideradas.
              </p>
            </section>

            {/* Seção 4 */}
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground md:text-2xl">
                4. Isenção de Responsabilidade
              </h2>
              <p className="leading-relaxed">
                Este sorteio{' '}
                <strong className="font-semibold text-foreground">
                  não é patrocinado, administrado ou associado
                </strong>{' '}
                ao Instagram, Facebook, TikTok ou qualquer outra plataforma utilizada para
                divulgação.
              </p>
              <p className="leading-relaxed">
                O sorteio será realizado de forma{' '}
                <strong className="font-semibold text-foreground">100% aleatória</strong>.
              </p>
            </section>

            {/* Seção 5 */}
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground md:text-2xl">
                5. Aceitação dos Termos
              </h2>
              <p className="leading-relaxed">
                Ao participar deste sorteio, o usuário declara ter lido, compreendido e aceito
                integralmente estes termos.
              </p>
            </section>
          </div>

          {/* Footer */}
          <div className="mt-12 border-t border-border pt-6">
            <p className="text-center text-sm text-muted-foreground">
              X1 Games Experience • Termos de Participação do Sorteio
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
