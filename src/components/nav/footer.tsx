export default function Footer() {
  return (
    <footer className=" backdrop-blur-3xl bg-black/70  text-white px-6 md:px-10 pt-14 pb-10  relative">
      <div className="grid grid-cols-1  lg:grid-cols-5 gap-12 max-w-7xl mx-auto">
        {/* Logo + Identity */}
        <div className="flex md:flex-col items-center gap-4 col-span-2">
          <img src="/logo.svg" alt="COLCOM Logo" className="w-12 h-12" />
          <div>
            <h3 className="text-2xl font-bold tracking-tight">
              COLCOM, FUNAAB
            </h3>
            <p className="text-sm text-white/70">
              Nigeria Association of Computing Students
              <br />
              "Towards Advanced Computing"
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col  gap-4">
          <h4 className="text-lg font-semibold">Explore</h4>
          <nav className="text-sm flex flex-col space-y-2 text-white/80">
            <a href="/" className="hover:text-white">
              Home
            </a>
            <a href="/pay" className="hover:text-white">
              Make Payment
            </a>
            <a href="#" className="hover:text-white">
              About COLCOM
            </a>
            <a href="#" className="hover:text-white">
              FAQs
            </a>
            <a href="/search">Search Receipt</a>
          </nav>
        </div>

        {/* Social Links */}
        <div className="flex flex-col gap-4">
          <h4 className="text-lg font-semibold">Connect</h4>
          <nav className="text-sm flex flex-col space-y-2 text-white/80">
            <a
              href="https://twitter.com/COLCOMFunaab"
              className="hover:text-white"
            >
              X (Twitter)
            </a>
            <a
              href="https://www.instagram.com/COLCOM_funaab/"
              className="hover:text-white"
            >
              Instagram
            </a>
            <a
              href="mailto:colcomfunaab@gmail.com"
              className="hover:text-white"
            >
              Email Us
            </a>
          </nav>
        </div>

        {/* Quick Contact CTA */}
        <div className="bg-[#08CF74] col-span-2 md:col-span-1 text-black rounded-xl p-5 flex flex-col gap-3 shadow-lg">
          <h4 className="text-lg font-bold">Need Help?</h4>
          <p className="text-sm">
            Having issues with payment or questions about COLCOM? Reach out
            directly.
          </p>
          <a
            href="mailto:colcomfunaab@gmail.com"
            className="text-sm font-semibold underline underline-offset-2"
          >
            colcomfunaab@gmail.com
          </a>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-white/10 my-10" />

      {/* Footer bottom */}
      <div className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto gap-4 text-xs md:text-sm text-white/60">
        <p>&copy; 2024 COLCOM, FUNAAB. All Rights Reserved.</p>
        <div className="flex gap-4">
          <CreditCard
            name="Temiloluwa Akinbote"
            role="Designer"
            image="images/temi.png"
            link="https://x.com/Temilo1Akinbote"
            icon="/pen.svg"
          />
          <CreditCard
            name="Egbetola Ayomikun"
            role="Developer"
            image="https://github.com/eniiku.png"
            link="https://github.com/eniiku"
            icon="/code.svg"
          />
        </div>
      </div>
    </footer>
  );
}

function CreditCard({
  name,
  role,
  image,
  icon,
  link,
}: {
  name: string;
  role: string;
  image: string;
  icon: string;
  link: string;
}) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 hover:text-white"
    >
      <div className="relative w-8 h-8">
        <img
          src={image}
          alt={name}
          className="rounded-full w-full h-full object-cover"
        />
        <img
          src={icon}
          alt={role}
          className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-yellow-300 p-[2px] border border-white"
        />
      </div>
      <span className="font-medium">{name}</span>
    </a>
  );
}
