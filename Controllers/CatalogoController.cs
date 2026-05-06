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
                Titulo = "Devil May Cry",
                Genero = "Hack and Slash",
                Ano = 2001,
                Consola = "PlayStation 2",
                Descripcion = "Videojuego que trata de un cazador..."
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
