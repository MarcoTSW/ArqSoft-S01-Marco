using Catalogo.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace Catalogo.Controllers
{
    public class CatalogoController : Controller
    {
        private static List<Item> _items = new()
        {
            new Item
            {
                Id = 1,
                Titulo = "Fortnite",
                Genero = "Battle Royale / Shooter",
                Ano = 2017,
                Consola = "Multiplataforma (PC, PS4, PS5, Xbox, Switch)",
                Descripcion = "Videojuego de supervivencia y construcción donde 100 jugadores luchan por ser el último en pie."
            },
            new Item
            {
                Id = 2,
                Titulo = "Castlevania: Symphony of the Night",
                Genero = "Metroidvania",
                Ano = 1997,
                Consola = "PlayStation",
                Descripcion = "Videojuego que trata de un cazador..."
            },
            new Item
            {
                Id = 3,
                Titulo = "NieR: Automata",
                Genero = "Action RPG",
                Ano = 2017,
                Consola = "PlayStation 4",
                Descripcion = "Videojuego que mezcla acción y filosofía existencial..."
            },
            new Item
            {
                Id = 4,
                Titulo = "Command and Conquer: Generals",
                Genero = "Estrategia en tiempo real (RTS)",
                Ano = 2003,
                Consola = "PC",
                Descripcion = "Un juego de estrategia militar donde las superpotencias del mundo se enfrentan utilizando tecnología de guerra moderna y tácticas en tiempo real"
            },
            new Item
            {
                Id = 5,
                Titulo = "League of Legends",
                Genero = "MOBA",
                Ano = 2009,
                Consola = "PC",
                Descripcion = "Un juego de estrategia por equipos en el que dos grupos de cinco campeones se enfrentan para ver quién destruye antes la base del otro."
            },
            new Item
            {
                Id = 6,
                Titulo = "Need for Speed: Porsche Unleashed",
                Genero = "Carreras / Simulación",
                Ano = 2000,
                Consola = "PC / PlayStation",
                Descripcion = "Un simulador de conducción centrado exclusivamente en la marca Porsche, que permite recorrer su historia y conducir modelos icónicos a través de varias décadas."
            },
            new Item
            {
                Id = 7,
                Titulo = "Emergency 4: Global Fighters for Life",
                Genero = "Estrategia / Simulación de rescate",
                Ano = 2006,
                Consola = "PC",
                Descripcion = "Un simulador de estrategia en tiempo real donde gestionas servicios de emergencia (bomberos, policía y médicos) para resolver desastres, accidentes y situaciones de crisis."
            }

        };

        // Lista — con filtro opcional por género
        public IActionResult Index(string? genero)
        {
            var resultado = string.IsNullOrEmpty(genero)
                ? _items
                : _items.Where(i => i.Genero == genero).ToList();

            ViewBag.Generos = _items.Select(i => i.Genero).Distinct().ToList();
            ViewBag.GeneroActual = genero;

            return View(resultado);
        }

        // Detalle
        public IActionResult Detalle(int id)
        {
            var item = _items.FirstOrDefault(i => i.Id == id);
            return item == null ? NotFound() : View(item);
        }

        // Formulario — GET
        public IActionResult Agregar()
        {
            return View();
        }

        // Formulario — POST
        [HttpPost]
        public IActionResult Agregar(Item item)
        {
            item.Id = _items.Count + 1;
            _items.Add(item);
            return RedirectToAction("Index");
        }
    }
}
